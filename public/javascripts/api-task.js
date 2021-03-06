window.addEventListener('DOMContentLoaded', (event) => {

    addCreateFunction();
    const updateButtons = document.querySelectorAll('.update-task-btn')
    updateButtons.forEach(button => addUpdateFunction(button))
    const deleteButtons = document.querySelectorAll('.delete-task-btn')
    deleteButtons.forEach(button => addDeleteFunction(button));
    searchTask();
    const completedBtn = document.querySelectorAll('.completed-task-btn')
    completedBtn.forEach(button => markCompletedFunction(button))
})

const addCreateFunction = () => {
    const addTaskButton = document.getElementById('new-button')

    addTaskButton.addEventListener('click', async (ev) => {
        ev.preventDefault();

        // Errors flicker when spamming add without proper info
        const errorsDisplay = document.getElementById('add-errors-display');
        if (errorsDisplay.firstChild) {
            errorsDisplay.childNodes.forEach(c => c.remove());
        }

        const textBox = document.getElementById('new-textbox');
        const dueDateBox = document.getElementById('dueDate');
        const hoursBox = document.getElementById('hours');
        const minutesBox = document.getElementById('minutes');
        const priorityBox = document.getElementById('importance');

        const description = textBox.value;
        const dueDate = dueDateBox.value;

        // console.log(dueDate);

        let hoursValue = hoursBox.value;
        let minutesValue = minutesBox.value;

        hoursValue ? hoursValue = parseInt(hoursValue, 10) : hoursValue = 0;
        minutesValue ? minutesValue = parseInt(minutesValue, 10) : minutesValue = 0;

        // console.log(hoursValue, minutesValue);

        const estimatedTime = hoursValue * 60 + minutesValue;
        // console.log(estimatedTime);

        const importance = priorityBox.value;

        const listId = window.location.href.split('/')[4]

        // console.log(listId, description, dueDate, estimatedTime, importance);

        const res = await fetch('/tasks', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",

            },
            credentials: 'include',
            body: JSON.stringify({ listId, description, dueDate, estimatedTime, importance })
        })

        const data = await res.json();


        if (data.errors) {

            data.errors.forEach(msg => {
                if (errorsDisplay.firstChild) {
                    errorsDisplay.childNodes.forEach(c => c.remove());
                }
                const li = document.createElement('li');
                li.innerText = msg;
                errorsDisplay.append(li);
            })

        } else {

            createTaskDiv(data);

        }

        textBox.value = null;
        dueDateBox.value = null;
        minutesBox.value = null;
        hoursBox.value = null;
        priorityBox.innerHTML = `
        <select name=importance id=importance>
            <option value=0> Priority </option>
            <option value=3> High </option>
            <option value=2> Medium </option>
            <option value=1> Low </option>
        </select>
        `;
    })
}

const addDeleteFunction = (button) => {
    button.addEventListener('click', async (ev) => {
        const taskId = button.id.split('-')[1]

        const res = await fetch(`/tasks/${taskId}`, {
            method: "DELETE"
        })

        const data = await res.json();
        if (data.message === "Task successfully deleted") {
            const container = document.getElementById(`task-container-${taskId}`)

            container.remove()
        }
    })
}

const addSaveFunction = (button, form) => {
    button.addEventListener('click', async (ev) => {
        ev.preventDefault();

        const taskId = button.id.split('-')[1]
        const taskListDiv = document.getElementById(`task-container-${taskId}`);

        // taskListDiv.classList.add('pre-open');

        const updateForm = document.getElementById(`update-form-${taskId}`);
        const dueDateInput = document.getElementById(`dueDate-${taskId}`)
        const dateValue = dueDateInput.value

        const divKids = taskListDiv.children;

        const updateDate = new FormData(form);
        // console.log(updateDate.entries(), "updateData")

        const dataObj = {};
        for (let pair of updateDate.entries()) {
            dataObj[pair[0]] = pair[1];
        }

        dataObj.dueDate = dateValue;
        dataObj.estimatedTime = parseInt(dataObj.hours, 10) * 60 + parseInt(dataObj.minutes, 10);

        const res = await fetch(`/tasks/${taskId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataObj)
        })

        const data = await res.json();


        if (data.errors) {
            const errorsDisplay = document.getElementById(`errors-${taskId}`);
            data.errors.forEach(msg => {
                if (errorsDisplay.firstChild) {
                    errorsDisplay.childNodes.forEach(c => c.remove());
                }
                const li = document.createElement('li');
                li.innerText = msg;
                errorsDisplay.append(li);
            });
        } else {
            for (let el of divKids) {
                el.style.display = '';
            }
            const li = document.getElementById(`task-list-${taskId}`);
            const taskDate = document.getElementById(`task-date-${taskId}`);
            const taskTime = document.getElementById(`task-time-${taskId}`);
            const taskImpt = document.getElementById(`task-impt-${taskId}`);

            li.innerText = dataObj.description;

            if (taskDate) {
                taskDate.innerText = dataObj.dueDate ? `Due: ${dataObj.dueDate}` : null;
            }

            if (taskTime) {
                taskTime.innerText = dataObj.estimatedTime ? `${dataObj.estimatedTime} Minutes` : null;
            }

            if (taskImpt) {
                taskImpt.innerText = dataObj.importance === '1' ? 'Priority: Low' : dataObj.importance === '2' ? "Priority: Medium" : dataObj.importance === '3' ? "Priority: High" : null;
            }

            updateForm.remove();
        }
    })
};

const addOption = (text, value, importance) => {
    const opt = document.createElement('option');
    opt.innerText = text;
    opt.value = value;
    if (value === importance) {
        opt.selected = 'selected';
    };
    return opt;
};

const addUpdateFunction = (button) => {
    button.addEventListener('click', async (ev) => {
        ev.preventDefault();

        const taskId = button.id.split('-')[1];

        const taskListDiv = document.getElementById(`task-container-${taskId}`);
        taskListDiv.classList.remove('pre-open');

        const divKids = taskListDiv.children;
        for (let el of divKids) {
            el.style.display = 'none';
        }

        const res = await fetch(`/tasks/${taskId}`, {
            method: "GET"
        });

        const data = await res.json()

        const { description, dueDate, estimatedTime, importance } = data;

        const minutes = estimatedTime % 60;
        const hours = Math.floor(estimatedTime / 60);

        const form = document.createElement('form');
        const textDiv = document.createElement('div');
        const dataDiv = document.createElement('div');
        const errorsDiv = document.createElement('div');
        const dueDateLabel = document.createElement('label');
        const timeLabel = document.createElement('label');
        const hoursLabel = document.createElement('label');
        const minutesLabel = document.createElement('label');
        const textInput = document.createElement('input');
        const dueDateInput = document.createElement('input');
        const hoursInput = document.createElement('input');
        const minutesInput = document.createElement('input');
        const select = document.createElement('select');
        const optionSelect = document.createElement('option');
        const optionHigh = addOption('High', 3, importance)
        const optionMed = addOption('Med', 2, importance)
        const optionLow = addOption('Low', 1, importance)
        const errorsDisplay = document.createElement('ul')
        const saveButton = document.createElement('button');

        // const csrfInput = document.createElement('input');
        // csrfInput.name = '_csrf'
        // csrfInput.type = 'hidden'
        // csrfInput.value = csrfToken

        form.id = `update-form-${taskId}`;
        // form.classList.add('entry');

        textInput.type = 'text';
        textInput.name = 'description';
        textInput.id = `text-box-${taskId}`;
        textInput.classList.add('update-text-input');
        textInput.value = description;

        dueDateLabel.for = 'dueDate';
        dueDateLabel.innerText = 'Due Date';
        dueDateInput.type = 'date';
        dueDateInput.id = `dueDate-${taskId}`;
        dueDateInput.value = dueDate;

        timeLabel.innerText = 'Estimated Time:';

        hoursLabel.for = 'hours';
        hoursLabel.innerText = "Hours";
        hoursInput.type = 'number';
        hoursInput.name = 'hours'
        hoursInput.id = `hours-${taskId}`
        hoursInput.value = hours;
        hoursInput.classList.add('update-time-input');
        hoursInput.min = 0;

        minutesLabel.for = 'minutes';
        minutesLabel.innerText = "Minutes";
        minutesInput.type = 'number';
        minutesInput.name = 'minutes';
        minutesInput.id = `minutes-${taskId}`;
        minutesInput.value = minutes;
        minutesInput.classList.add('update-time-input');
        minutesInput.min = 0;

        select.name = 'importance';
        select.id = `importance-${taskId}`;
        optionSelect.innerText = "Priority";
        optionSelect.value = 0;

        saveButton.innerHTML = '<i class="fas fa-save"></i>';
        saveButton.id = `save-${taskId}`;
        saveButton.classList.add('update-save-btn')
        addSaveFunction(saveButton, form);

        errorsDisplay.id = `errors-${taskId}`;
        errorsDiv.appendChild(errorsDisplay);

        select.appendChild(optionSelect);
        select.appendChild(optionHigh);
        select.appendChild(optionMed);
        select.appendChild(optionLow);

        textDiv.appendChild(textInput);

        dataDiv.classList.add('task-options-div');

        dataDiv.appendChild(dueDateLabel);
        dataDiv.appendChild(dueDateInput);
        dataDiv.appendChild(timeLabel);
        dataDiv.appendChild(hoursLabel);
        dataDiv.appendChild(hoursInput);
        dataDiv.appendChild(minutesLabel);
        dataDiv.appendChild(minutesInput);
        dataDiv.appendChild(select);
        dataDiv.appendChild(saveButton);

        form.appendChild(textDiv);
        form.appendChild(dataDiv);
        form.appendChild(errorsDiv);
        // form.appendChild(csrfInput)

        taskListDiv.appendChild(form);
    })
}

const searchTask = () => {
    const searchInput = document.getElementById('searchbar')
    searchInput.addEventListener('keyup', async (ev) => {

        const listId = window.location.href.split('/')[4]

        const res = await fetch(`/tasks/search`, {
            method: "GET"
        })

        const resO = await fetch(`/lists/${listId}/tasks`, {
            method: "GET"
        })

        const data = await res.json()
        const originalTasks = await resO.json();

        const divs = document.querySelectorAll(`.search-list-container`)
        // console.log(divs)

        for (let i = 0; i < divs.length; i++) {
            let div = divs[i]
            div.remove()

        }

        for (let i = 0; i < data.length; i++) {

            if (searchInput.value && data[i].description.toLowerCase().includes(searchInput.value.toLowerCase())) {

                createTaskDiv(data[i]);

            } else if (!searchInput.value) {

                createTaskList(originalTasks);

            }
        }
    })
}

const createTaskList = (tasks) => {
    const disp = document.getElementById('task-list-display');
    const ul = document.getElementById('task-list-render');
    ul.remove();
    const newUl = document.createElement('ul');
    newUl.id = 'task-list-render';

    disp.appendChild(newUl);

    tasks.forEach(task => {
        createTaskDiv(task);
    })
}

const markCompletedFunction = (button) => {

    button.addEventListener('click', async (ev) => {
        ev.preventDefault();


        const taskId = button.id.split('-')[1]

        const res = await fetch(`/tasks/${taskId}/completed`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ completed: true })
        })

        const data = await res.json()

        // const div = document.getElementById('tasks-completed')
        const ul = document.getElementById('tasks-completed-list')
        const li = document.createElement('li')

        data.completedTasks.forEach((task, i) => {
            const valueLi = document.getElementById(`task-list-${taskId}`).innerText

            if (task.description === valueLi) {
                li.innerText = task.description
                ul.prepend(li)
            }
        })

        const userLvl = document.getElementById('user-level');
        const userExp = document.getElementById('exp-progress');
        const userExpNum = document.getElementById('user-exp-num');

        if (parseInt(userLvl.innerText, 10) !== data.user.level) {
            userLvl.innerText = `${data.user.level}`;
            setTimeout(() => {
                window.alert('Level Up!')
            }, 350)
        }

        userExp.style.width = `${data.user.exp / 10}%`;
        userExpNum.innerText = `${data.user.exp} / 1000`;

        // div.appendChild(ul)
        const removeDiv = document.getElementById(`task-container-${taskId}`)
        removeDiv.remove()
    })
}


const createTaskDiv = (data) => {
    const ul = document.getElementById('task-list-render');

    const container = document.createElement('div');
    container.id = `task-container-${data.id}`;
    container.className = "search-list-container";
    container.classList.add('entry');
    // container.classList.add('pre-open');
    //add class

    const secondContainer = document.createElement('div');
    secondContainer.classList.add("pre-open");

    const li = document.createElement('li');
    li.id = `task-list-${data.id}`;
    li.className = "search-list"
    // add class
    li.innerText = data.description;

    const buttons = document.createElement('div');

    const updateBtn = document.createElement('button');
    updateBtn.id = `update-${data.id}`;
    updateBtn.innerHTML = '<i class="fas fa-feather"></i>';
    updateBtn.classList.add('update-task-btn');

    const deleteBtn = document.createElement('button');
    deleteBtn.id = `delete-${data.id}`;
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.classList.add('delete-task-btn');

    const completeBtn = document.createElement('button');
    completeBtn.id = `completed-${data.id}`
    completeBtn.innerHTML = '<i class="fas fa-check"></i>';
    completeBtn.classList.add('completed-task-btn');

    const infoDiv = document.createElement('div');
    infoDiv.id = `task-info-${data.id}`;
    infoDiv.classList.add('task-info-div');

    const dateSpan = document.createElement('span');
    dateSpan.classList.add('grid-a');
    dateSpan.id = `task-date-${data.id}`;
    dateSpan.innerText = data.dueDate ? `Due: ${data.dueDate}` : null;

    // const timeImptDiv = document.createElement('div');
    // timeImptDiv.classList.add('time-impt-container');

    const timeSpan = document.createElement('span');
    timeSpan.classList.add('grid-c');
    timeSpan.id = `task-time-${data.id}`;
    timeSpan.innerText = data.estimatedTime ? `${data.estimatedTime} Minutes` : null;

    const imptSpan = document.createElement('span');
    imptSpan.classList.add('grid-d');
    imptSpan.id = `task-impt-${data.id}`;
    imptSpan.innerText = data.importance === 1 ? 'Priority: Low' : data.importance === 2 ? "Priority: Medium" : data.importance === 3 ? "Priority: High" : null

    container.appendChild(secondContainer);
    secondContainer.appendChild(li);
    buttons.appendChild(updateBtn);
    buttons.appendChild(deleteBtn);
    buttons.appendChild(completeBtn)
    secondContainer.appendChild(buttons);
    infoDiv.appendChild(dateSpan);
    // timeImptDiv.appendChild(timeSpan);
    // timeImptDiv.appendChild(imptSpan);
    infoDiv.appendChild(timeSpan);
    infoDiv.appendChild(imptSpan);
    // infoDiv.appendChild(timeImptDiv);
    container.appendChild(infoDiv);
    ul.appendChild(container);

    // console.log(ul);

    addDeleteFunction(deleteBtn);
    addUpdateFunction(updateBtn)
    markCompletedFunction(completeBtn)
}
