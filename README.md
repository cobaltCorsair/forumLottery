# Lottery Application for MyBB/RusFF Forum

This application offers a unique feature for users of MyBB/RusFF forums: a lottery system that showcases items to users who visit the main page at specific intervals. The application uses server-side code to store an array of data received from the client.

---

## Features:

1. **Server-side Data Storage**: Using a PHP backend, data is stored in a JSON file on the server.
2. **Dynamic Lottery Display**: The lottery system displays items to users based on their group permissions.
3. **Data Copy to Forum Reply**: Users can easily copy lottery data and insert it into forum reply boxes.

---

## File Overview:

1. **api.php**: Server-side PHP script to handle data storage and retrieval.
2. **copyScript.js**: A script to assist users in copying lottery data into forum reply boxes.
3. **header.js**: Initializes the lottery system on the forum main page.
4. **lotteryAppWithApi.js**: Core logic of the lottery system.
5. **panel.html**: UI components and layout of the lottery system.
6. **style.css**: Styling for the lottery system components.

---

## Setup & Installation:

1. Upload all the files to your server.
2. Include `header.js` in the header of your forum main page.
3. Ensure the server has write permissions for the directory where `api.php` resides to allow data storage in a JSON file.
4. Update the `forumThreadUrl` in `header.js` to point to the specific thread where users will post their lottery results.

---

## Usage:

1. Users from allowed groups will see the lottery items on the forum's main page.
2. Users can interact with the lottery system, and their interactions will be stored server-side.
3. When a user wishes to post their lottery results in the specified thread, the data will be automatically copied into the reply box for convenience.

---

## Customization:

- To allow or restrict access to specific user groups, modify the `allowedGroups` array in `header.js`.
- Style customization can be done via `style.css`.

---

## Troubleshooting:

- Ensure your server has the necessary permissions to write to the directory for data storage.
- Ensure all JavaScript files are correctly linked and loaded.
- Check the browser console for any errors and address them accordingly.

---

## Contribution:

Feel free to contribute to the project by submitting pull requests or opening issues on the repository.

---

## License:

This project is licensed under the MIT License.

---

## Credits:

Developed by [cobaltCorsair](https://github.com/cobaltCorsair/).

