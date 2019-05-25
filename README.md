### Setting up development environment:

0. Ubuntu.
1. [vscode](https://code.visualstudio.com/docs/setup/linux)
2. npm: `sudo apt install npm`
3. python3
4. [Pycharm](https://www.jetbrains.com/help/pycharm/installation-guide.html?section=Linux)
5. django

### Building the client:

1. `git clone git@github.com:jrojer/prices.git`
2. `cd ./prices/client`
3. `npm install`
4. Open directory in vscode
5. Run build. This will create the *static* folder with bundle in the root of the project

### Running the server:

1. Open the *server* directory in Pycharm
2. In *Edit Configurations* set script: **manage.py**, argument: **runserver**
3. Run

