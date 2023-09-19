let users = [];

exports.addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!name || !room) return { error: "Username and room are required." };

  const userExists = users.find(
    (user) => user.room === room && user.name === name
  );

  if (userExists) {
    return { error: "user already exists" };
  }

  let user = { id, name, room };

  users.push(user);

  return { user };
};

exports.removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    {
      return users.splice(index, 1)[0];
    }
  }
};

exports.getUser = (id) => users.find((user) => user.id == id);

exports.getUsersInRoom = (room) => {
  users.filter((user) => user.room === room);
};
