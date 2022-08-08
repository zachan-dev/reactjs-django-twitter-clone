<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Thanks again! Now go create something AMAZING! :D
***
***
***
*** To avoid retyping too much info. Do a search and replace for the following:
*** zachan-dev, reactjs-django-twitter-clone, zachan_dev, zach@zachan.dev, Twitter Clone, An attempt to build a React.js-Django app cloning Twitter
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://zach-reactdjango-twitterclone.herokuapp.com/">
    <img src="README_contents/images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Twitter Clone</h3>

  <p align="center">
    An attempt to build a React.js-Django app cloning Twitter
    <br />
    <a href="https://github.com/zachan-dev/reactjs-django-twitter-clone"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://zach-reactdjango-twitterclone.herokuapp.com/">View Deployment</a>
    ·
    <a href="https://github.com/zachan-dev/reactjs-django-twitter-clone/issues">Report Bug</a>
    ·
    <a href="https://github.com/zachan-dev/reactjs-django-twitter-clone/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

![Screen Shot](./README_contents/images/screenshot.png)

Twitter Clone is a Django-React web application cloning Twitter web app.

### Built With

* [Node](https://nodejs.org/)
* [React](https://reactjs.org/)
* [Django REST Framework](https://www.django-rest-framework.org/)
* [Material UI](https://material-ui.com/)



<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

Make sure npm and python are installed.
* npm
  ```sh
  npm --version
  ```
* python
  ```sh
  python3 --version
  ```
* [Postgres.app](https://postgresapp.com/)
  * Only for Mac
  

### Installation

1. Clone the repo and navigate to directory
   ```sh
   git clone https://github.com/zachan-dev/reactjs-django-twitter-clone.git
   cd reactjs-django-twitter-clone
   ```
2. Activate python virtual environment
   - Windows:
   ```sh
   python3 -m venv testVenv
   testVenv\Scripts\activate.bat
   ```
   - Linux/MacOS:
   ```sh
   python3 -m venv testVenv
   source testVenv/bin/activate
   ```
   Export postgres path
    - MacOS:
    ```sh
    export PATH=$PATH:/Applications/Postgres.app/Contents/Versions/latest/bin
    ```
3. Install PIP packages
   ```sh
   pip install -r requirements.txt
   ```
4. Install NPM packages
   ```sh
   cd frontend
   npm install
   ```
5. Build React outputs
   - For Development Environment
   ```sh
   npm run dev
   ```
   - For Production Environment
   ```sh
   npm run build
   ```
  
6. Create a top-level `.env` file
   ```sh
   cd ..
   touch .env
   ```
   - With Following Contents:
      ```raw
      SECRET_KEY=<your_secret_key>
      DEBUG=True
      DATABASE_URL=
      ```
      (Simply leave DATABASE_URL as empty.)
      
7. Django Init
   ```sh
   python manage.py makemigrations network
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser

8. Run Django Server
   ```sh
   python manage.py runserver
   ```

<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_



<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/zachan-dev/reactjs-django-twitter-clone/issues) for a list of proposed features (and known issues).



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

Your Name - [@zachan_dev](https://twitter.com/zachan_dev) - zach@zachan.dev

Project Link: [https://github.com/zachan-dev/reactjs-django-twitter-clone](https://github.com/zachan-dev/reactjs-django-twitter-clone)



<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements

* []()
* []()
* []()





<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/zachan-dev/reactjs-django-twitter-clone.svg?style=for-the-badge
[contributors-url]: https://github.com/zachan-dev/reactjs-django-twitter-clone/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/zachan-dev/reactjs-django-twitter-clone.svg?style=for-the-badge
[forks-url]: https://github.com/zachan-dev/reactjs-django-twitter-clone/network/members
[stars-shield]: https://img.shields.io/github/stars/zachan-dev/reactjs-django-twitter-clone.svg?style=for-the-badge
[stars-url]: https://github.com/zachan-dev/reactjs-django-twitter-clone/stargazers
[issues-shield]: https://img.shields.io/github/issues/zachan-dev/reactjs-django-twitter-clone.svg?style=for-the-badge
[issues-url]: https://github.com/zachan-dev/reactjs-django-twitter-clone/issues
[license-shield]: https://img.shields.io/github/license/zachan-dev/reactjs-django-twitter-clone.svg?style=for-the-badge
[license-url]: https://github.com/zachan-dev/reactjs-django-twitter-clone/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/zach-chan-hk/
