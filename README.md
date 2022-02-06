# SchoolJournal
 
This API allows user to work with school journals, or xlsx tables, formed in a specific way.
Currently, such features are available:
 - creating a journal:
    - send a POST request to path "localhost:3000/tables/createTable" with a body:
    {
        name: Name of the journal.
        params: {
            subjects: What subjects will the journal contain. For each subject, a new page in the journal will be taken
            students: The students whose progress will be tracked with the journal. Each subject page will contain the same same list of students.
            starting_date: The date in the "XX.YY" format. All the pages' dates will start from this date.
            page_size: The amount of dates each journal page will contain. This feature cost me a lot of time, but was made in an effort to replicate regular paper journals: they also have a date-per-page limit, which is the size of A4-list's side.
        }
    }
    Each part of the "params" section can be ommited and will be replaced by default parameters.

 - setting a mark for the student: 
    - send a POST request to path "localhost:3000/tables/setMark" with a body: 
    {
        subject: Subject to set the mark for.
        student: Student to grade.
        mark: Mark.
        date: A date in "XX.YY" format
    }
    If a date exceeds the limit of the page, new pages are created until a mark can be placed. This cound be considerably simplified, but, again, i tried to make it "realistic".