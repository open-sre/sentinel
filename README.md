<p align="center">
<img src="https://github.com/open-sre/sentinel/blob/master/readme_images/sentinel-logo.jpg?raw=true" height="120" />
</p>

<h2 align="center">
  Blackbox Health Checking<br />
  - ping any url -</br>
  - view your urls response to external requests -
</h2>

<br/>

<p align="center">
  Sentinel is a <strong>black box probing</strong> toolkit, made for checking the live health of urls, from an external environment.<br><br>
  Your application and service urls may seem healthy from inside, but how would you know whether they respond as expected to your external customers???<br><br>
  Sentinel is a lightweight toolkit, that can ping thousands of urls at a given second.<br><br>
  This tool is for developers, testers, and SREs.
</p>

<p align="center">
  Got a question? Want to share how you use Sentinel? ➡️  <a href="https://github.com/open-sre/sentinel/discussions">Sentinel Discussion Board</a>
</p>


# Use Cases

- Periodically checking URLs to see whether external users can access them without issues and detecting bottlenecks in DNS, CDN, pods, and other dependent services
- Triggering external traffic for urls which may have low traffic

# Features

- **Test ANY url protocol**:  Currently supports https and http
- **Cloud-native**: Go from running a test locally to running it in your own local machine, which can also be distributed across different geographies.
- **and more!** Await more features

# Getting Started With Sentinel

### Step 0: check for prerequisites

- Install [NodeJS](https://nodejs.org/en/)

### Step 1: clone the repository

```
git clone https://github.com/Keetmalin/sentinel.git
cd sentinel
```
### Step 2: install the dependencies
```
npm install
```

### Step 3: preparing your configs

See the sample config given in `./configs.json` file. Given below is an explanation of the config.

```
{
        "id": "customID",  // unique for each config
        "pollSeconds": 10, // how frequently do you want to ping
        "name": "name", // name of the url, for reference and reporting
        "endpoint": "https://www.example.com/", // endpoint to be pinged
        "metadata": { // include custom metadata which will be included in the reporting
            "region": "Asia"
        }
    }
```

### Step 4 (Optional): Set up environment variables

Environment variables in use:
- `REFRESH_INTERVAL`: This will check your configs and refresh them. This value is in seconds. This allows you to dynamically change the configs without stopping the script. Default value is 300 seconds (5 minutes).

Linux based machines can use the following to set up environment variables

```
export REFRESH_INTERVAL=600
```

# License

**Sentinel** is open-source software distributed under the terms of the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) license.

