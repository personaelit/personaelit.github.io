public class Notes
{
    // The list of notes
    private List<string> notes = new List<string>();

    // Adds a note to the list
    public void AddNote(string note)
    {
        notes.Add(note);
    }

    // Removes a note from the list
    public void RemoveNote(string note)
    {
        notes.Remove(note);
    }

    // Prints all the notes in the list
    public void PrintNotes()
    {
        foreach (string note in notes)
        {
            Console.WriteLine(note);
        }
    }
}

//To use this class, you can create an instance of the Notes class and call its methods:

Notes myNotes = new Notes();
myNotes.AddNote("Remember to buy milk");
myNotes.AddNote("Pay the electricity bill");
myNotes.PrintNotes(); // Output: "Remember to buy milk" "Pay the electricity bill"
myNotes.RemoveNote("Remember to buy milk");
myNotes.PrintNotes(); // Output: "Pay the electricity bill"