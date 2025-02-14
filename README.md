# Log app for LogicMachine

A tool to search, and delete logs in LogicMachine.

![Showcase image](https://github.com/mentisy/logicmachine-log/blob/main/showcase.png)

Supports all log types:
* Object log
* Alert log
* Error log
* Log (general)

## Installation:
1. Go to LogicMachine front page
2. Click the + icon on the top-right
3. On the next page, click the bars icon on the top-left
4. Select "Install from file"
5. Click "Choose file" and browse to the downloaded installation file
6. Click "OK"

You should see the newly installed "Logs" app on the list. You might
need to press the green bar saying "Installed (uninstall, update, configure)" to see it.

After that, go back to the front page, and you can start using the app.

If you encountered any problems installing the application, please create a new issue in this repository.

## Tested on following LogicMachine hardware/firmware:
* LM5 Lite (i.MX28) / 20210806
* LM5 Lite (i.MX6) / 20210510
* LM5 Lite (i.MX6) / 20210521
* LM5 Lite (i.MX6) / 20211014
* LM5 Lite + Ext (i.MX6) / 20211215

## Compiling (building) the code yourself
### Frontend
This app uses TypeScript with the React framework as the frontend, so you'll need to build
it using `node` tooling. Here's how:
1. Go to directory frontend
2. Run command `npm run build`
3. Built files are placed into the `frontend/dist` folder

### Backend
This app uses LogicMachine's selected language, Lua, to create the backend part. After building
the frontend part, you can build the installation file archive.
1. Run the script `build.sh` with the command `./build.sh`
2. Built files, including the frontend and backend, are archived into the `lm-logs.ipk` file.

This is the file that you'll need to load into the LogicMachine installation process. See `#Installation`.
