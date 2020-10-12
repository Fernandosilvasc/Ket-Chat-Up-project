const users = []

const addUser = ({ id, username, room }) => {
    console.log(username)
    console.log(room)
    username = username.trim().toLowerCase() // make the username's name to be lowercase
    room = room.trim().toLowerCase() // make the room's name be lowercase


    // const existingUser = users.find((user) => user.room === room && user.username === username)

    // if(!username || !room) return {error: 'Username and room are required'}
    // if(existingUser) return {error: 'Username already taken'}
    const user = { id, username, room }
    users.push(user)

    return { user }

}
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }


}
const getUser = (id) => {
    return users.find((user) => user.id === id)


}
const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room)
}

module.exports = { addUser, removeUser, getUser, getUsersInRoom }