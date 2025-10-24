let weather = '';
export function setWeather(mood) {
    switch (mood) {
        case '1':
            return 'stormy';
        case '2':
            return 'rainy';
        case '3':
            return 'foggy';
        case '4':
            weather = 'cloudy';
            break;
        case '5':
            weather = 'sunny';
            break;
        default:
            weather = '';
    }
}

export function getCurrentWeather() {
    return weather;
}