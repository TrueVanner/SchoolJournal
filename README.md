# SchoolJournal
 
This API allows user to work with school journals, or xlsx tables, formed in a specific way.
Currently, such features are available:

 - logging in: 
    - send a POST request to path "localhost:3000/auth/login" with a body: 
    {
        journal_name: name of the journal.
    }
 Logging in does not currently have any effect, but will in the future.
 
 - creating a journal:
    - send a POST request to path "localhost:4000/table/createJournal" with a body:
    {
        name: Name of the journal.
        parameters: {
            subjects: What subjects will the journal contain. For each subject, a new page in the journal will be taken
            students: The students whose progress will be tracked with the journal. Each subject page will contain the same same list of students.
            starting_date: The date in the "XX.YY" format. All the pages' dates will start from this date.
            page_size: The amount of dates each journal page will contain. This feature cost me a lot of time, but was made in an effort to replicate regular paper journals: they also have a date-per-page limit, which is the size of A4-list's side.
        }
    }
    Each part of the "params" section can be ommited and will be replaced by default parameters.

 - setting a mark for the student: 
    - send a PUT request to path "localhost:4000/table/setMark" with a body: 
    {
        subject: Subject to set the mark for.
        student: Student to grade.
        mark: Mark.
        date: A date in "XX.YY" format
    }
    If a date exceeds the limit of the page, new pages are created until a mark can be placed. This cound be considerably simplified, but, again, i tried to make it "realistic".
    
- adding a student: 
    - send a POST request to path "localhost:4000/table/addStudent" with a body: 
    {
        student: student name to add.
    }    
- removing a student: 
    - send a DELETE request to path "localhost:4000/table/removeStudent" with a body: 
    {
        student: student name to remove.
    }    
- updating a student: 
    - send a POST request to path "localhost:4000/table/updateStudent" with a body: 
    {
        old_student: student name to update;
        new_student: new student name
    }
    
- adding a subject: 
    - send a POST request to path "localhost:4000/table/addSubject" with a body: 
    {
        subject: subject name to add.
    }
    A new subject page will be created with the same students as all the other subject pages, and the starting date being the starting date of the journal.
    
- removing a subject: 
    - send a DELETE request to path "localhost:4000/table/removeSubject" with a body: 
    {
        subject: subject name to remove.
    }
    All subject pages, including copies, will be removed entirely.
    
- updating a subject: 
    - send a POST request to path "localhost:4000/table/updateSubject" with a body: 
    {
        old_subject: subject name to update;
        new_subject: new subject name
    }
    All subject pages' names, including copies, will be updated. The content within will remain unchanged.
    
- downloading the journal: 
    - send a GET request to path "localhost:4000/table/getJournal" from any compatible browser. Your journal will be immediately downloaded to your device.