Features:
    1. Users (create a new account)
        - Users can sign up, log in, and log out.
        - Users can use a demo log in to try out the site.
        - Users can't use certain features without logging in.
        - Logged in users are directed to their profile page which displays their tasks/lists.
        - Logged out users are directed to a log in page.
        - BONUS: Profile Page / extension of the user CRUD / not feature, but fluff
            - Logged in users can look at their profile page
            - Logged in users can update their profile picture
            - Logged in users can change their background/theme (more unlocked by level)
            - Logged in users can select a class and promote classes (bonus)
        - BONUS: Create a level up window/animation
            - Alerts the user when they level up
            - Includes updates on what is now accessible to the user

    2. Tasks
        - Logged in users can create a task with the following attributes:
            - Assigned to a specific list
            - Name/description
            - Estimated time to complete (amount of exp?)
            - Difficulty (amount of exp?)
            - Start dates/due dates (bonus?)
        - Logged in users can update/edit a task
            - Update the above information
             - Reassign to a list/different list
        - Logged in users can mark a task as complete
        - Logged in users can delete a task
        - Logged in users can access deleted tasks in the trash (bonus?)
            - either save to delete table or use boolean to identify it as trash or not

    3. Lists
        - Logged in users can create a new list
        - Logged in users can view the tasks in each of their lists
            - Types of lists:
                - Inbox(default)
                - Personal
                - Work
                - Custom - think of list table as composite list of all tables
                    - userid
                    - string - user sets the string
                    - user.findAll (where: user's string)
        - Logged in users can change the name of their lists
        - Logged in users can delete their lists
        - Logged in users can view a summary of each of their lists
            - # of tasks completed
            - # of tasks total
            - estimated time remaining
            - possible exp left to gain? (bonus?)
        - Sort by time, due date, priority, etc. (Bonus)


    4. Search
        - Logged in users can search for tasks by name in all lists


    5. BONUS: Subtasks
        - Logged in users can break down tasks into smaller subtasks
        - (With exp - users only get exp from completing the larger task)
        - Lock it behind level
        - full feature - its own table

<!--
    6. BONUS: Autocomplete search feature?
        - uses an array of possible/past terms
-->