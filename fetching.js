const url = 'https://scrum-board-4eb67-default-rtdb.europe-west1.firebasedatabase.app/tasks.json';
const header = {
  "Content-type": "application/json; charset=utf-8"
}


async function getTasks() {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch tasks');
  }
  const data = await res.json();
  return data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
}

async function addTask(taskData, assignee) {
  taskData.assigned = assignee;
  taskData.category = category;
  taskData.status = "to do"; 

  const res = await fetch(url, {
    method: 'POST',
    headers: header,
    body: JSON.stringify(taskData)
  });
  if (!res.ok) {
    throw new Error('Failed to add task');
  }

  return res.json();
}

async function updateTask(id, newData) {
  const updateUrl = `https://scrum-board-4eb67-default-rtdb.europe-west1.firebasedatabase.app/tasks/${id}.json`;
  const res = await fetch(updateUrl, {
    method: 'PATCH',
    headers: header, 
    body: JSON.stringify(newData)
  });
  if (!res.ok) {
    throw new Error('Failed to update task');
  }

  return res.json();
}

async function deleteTask(id) {
  const deleteUrl = `https://scrum-board-4eb67-default-rtdb.europe-west1.firebasedatabase.app/tasks/${id}.json`;
  const res = await fetch(deleteUrl, {
    method: 'DELETE'
  });
  if (!res.ok) {
    throw new Error('Failed to delete task');
  }

  return res.json();
}

export { getTasks, addTask, updateTask, deleteTask };
