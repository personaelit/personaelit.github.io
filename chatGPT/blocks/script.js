function recycleBlock(id, dbName, storeName) {
    const request = indexedDB.open(dbName, 1);

    request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(storeName, 'readwrite');
        const objectStore = transaction.objectStore(storeName);

        // Get the current state of the block
        const getStateRequest = objectStore.get(id);
        getStateRequest.onsuccess = function(event) {
            const currentState = event.target.result;

            // Calculate the top position of the new block in the bin
            let blockHeightWithPadding = 150 + 10; // Block height (150px) plus padding (10px)
            let numberOfBlocksInBin = $('#bin').children('.editableDiv').length;
            let topPosition = numberOfBlocksInBin * blockHeightWithPadding;

            // Keep the existing content and update the position
            const updatedData = {
                id: id,
                content: currentState.content,
                position: {
                    top: topPosition,
                    left: 0,
                    inBin: true // Set inBin to true
                }
            };

            objectStore.put(updatedData);

            transaction.oncomplete = function() {
                console.log('Block recycled in IndexedDB');
            };
        };
    };
}





$(document).ready(function () {
    const dbName = 'DivsDB';
    const storeName = 'divStates';

    // Initialize the IndexedDB
    let openRequest = indexedDB.open(dbName, 1);
    openRequest.onupgradeneeded = function (event) {
        let db = event.target.result;
        db.createObjectStore(storeName, { keyPath: 'id' });
    };

    openRequest.onsuccess = function (event) {
        let db = event.target.result;
        loadState(db);
    };

    function createDiv(titleContent = 'Title', content = 'Content') {
        let id = new Date().getTime();
        let timestamp = new Date(parseInt(id)).toLocaleString();
    
        let $div = $('<div>', {
            class: 'editableDiv',
            id: id
        });
    
        let $title = $('<h3>', {
            class: 'block-title',
            contenteditable: 'true',
            text: titleContent
        }).appendTo($div);
    
        let $timestamp = $('<div>', {
            class: 'timestamp',
            text: timestamp
        }).appendTo($div);
    
        let $content = $('<div>', {
            class: 'block-content',
            contenteditable: 'true',
            text: content
        }).appendTo($div);
        
        
        

        $div.draggable({
            containment: 'document',
            stop: function () {
                getDB(function (db) {
                    saveState(db);
                });
            }
        });

        $div.on('input', function () {
            getDB(function (db) {
                saveState(db);
            });
        });

        $div.appendTo('#container');

        // Calculate random x and y coordinates within the container's bounds
        let containerWidth = $('#container').width();
        let containerHeight = $('#container').height();

        let divWidth = $div.outerWidth();
        let divHeight = $div.outerHeight();

        let randomX = Math.floor(Math.random() * (containerWidth - divWidth));
        let randomY = Math.floor(Math.random() * (containerHeight - divHeight));

        // Set the initial position of the div to the random coordinates
        $div.css({
            'position': 'absolute',
            'left': randomX + 'px',
            'top': randomY + 'px'
        });

        return $div;
    }

    $('#spawnBlock').on('click', function () {
        createDiv();
    });

    $('.recycle-icon').droppable({
        accept: '.editableDiv',
        over: function (event, ui) {
            ui.helper.css('opacity', '0.5');
        },
        out: function (event, ui) {
            ui.helper.css('opacity', '1');
        },
        drop: function (event, ui) {
            let $div = ui.draggable;
            let id = $div.attr('id');

            // Calculate the top position of the new block in the bin
            let blockHeightWithPadding = 150 + 10; // Block height (150px) plus padding (10px)
            let numberOfBlocksInBin = $('#bin').children('.editableDiv').length;
            let topPosition = numberOfBlocksInBin * blockHeightWithPadding;

            // Update the div in the DOM
            $div.css({ top: topPosition, left: 0 }).appendTo('#bin');

            // Recycle the div in the IndexedDB
            recycleBlock(id, dbName, storeName);


        }
    });

    // let $div = ui.draggable;
    // let id = $div.attr('id');

    // // Update the div in the DOM
    // $div.text('').appendTo('#bin');

    // // Recycle the div in the IndexedDB
    // recycleBlock(id, dbName, storeName);



    function getDB(callback) {
        let openRequest = indexedDB.open(dbName, 1);
        openRequest.onsuccess = function (event) {
            let db = event.target.result;
            callback(db);
        };
    }

    function saveState(db) {
        let tx = db.transaction(storeName, 'readwrite');
        let store = tx.objectStore(storeName);
    
        $('.editableDiv').each(function() {
            let divData = {
                id: $(this).attr('id'),
                titleContent: $(this).find('.block-title').text(), // Add this
                content: $(this).find('.block-content').text(), // Update this
                position: $(this).position()
            };
            store.put(divData);
            console.log({divData});
        });
    }
    

    $('.recycle-icon').on('click', function () {
        $('#bin').toggleClass('open');
    });

    $('#binClose').on('click', function () {
        $('#bin').removeClass('open');
    });


    function loadState(db) {
        let tx = db.transaction(storeName, 'readonly');
        let store = tx.objectStore(storeName);
        let getRequest = store.getAll();
    
        getRequest.onsuccess = function(event) {
            let divStates = event.target.result;
            for (let state of divStates) {
                let $div = createDiv(state.titleContent, state.content);
                $div.attr('id', state.id);
                $div.css({
                    'top': state.position.top + 'px',
                    'left': state.position.left + 'px'
                });
    
                if (state.position.inBin) {
                    $div.appendTo('#recycle-bin');
                } else {
                    $div.appendTo('#container');
                }
            }
        };
    }
    
    

});
