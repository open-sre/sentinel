<p align="center">
<img src="https://github.com/open-sre/sentinel/blob/master/readme_images/sentinel-logo.jpg?raw=true" height="120" />
</p>

<h2 align="center">
  Syntetic Monitoring</br >
  Deploy in cloud | Blackbox Health Checks | Metrics and Alerting</br>
</h2>

<br/>

<p align="left">
  Sentinel is a free and open source <strong>Synthetic Monitoring</strong> toolkit, allows you to <strong>run your own black-box monitoring on prem or cloud</strong> , made for checking the live health of urls, from an external environment.<br><br>
  Your application and service urls may seem healthy from inside, but how would you know whether they respond as expected to your external customers???<br><br>
  Sentinel is a lightweight toolkit, that can ping thousands of urls at a given second.<br><br>
  This tool is for developers, testers, dev-ops and SREs.
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
- **Prometheus Integrated**: This service pushes all metrics to Prometheus, if you already have a Prometheus setup in your environment.
- **and more!** Await more features

# Getting Started With Sentinel

### Step 0: check for prerequisites

- Install [NodeJS](https://nodejs.org/en/). Please make sure to install a node version greater than or equal to 14. you can check this by running `node --version`.

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
        "pollSeconds": 10, // how frequently do you want to ping
        "name": "name", // name of the url, for reference and reporting
        "endpoint": "https://www.example.com/", // endpoint to be pinged
        "metadata": { // include custom metadata which will be included in the reporting (optional)
            "region": "Asia"
        }
    }
```

### Step 5: Run the application
Simply execute below command
```
node index.js
```

### Step 4 (Optional): Set up environment variables

Environment variables in use:
- `REFRESH_INTERVAL`: This will check your configs and refresh them. This value is in seconds. This allows you to dynamically change the configs without stopping the script. Default value is 300 seconds (5 minutes).
- `PROMETHEUS_METRIC_PREFIX`: This will be used as a prefix for the prometheus metrics exposed from Sentinel. The default is `sentinel_probing_`. 
- `SERVER_PORT`: This is the port this service will be running in. Default value is 8080. On this port, the server will expose its endpoints for health and Prometheus Scraping.

Linux based machines can use the following to set up environment variables

```
export REFRESH_INTERVAL=600
export PROMETHEUS_METRIC_PREFIX=custom_prometheus_prefix_
export SERVER_PORT=8080
```

### API Endpoints exposed by the service

Sentinel exposes two endpoints running on port 8080. You can change this port by setting up an enviornment variable as given in Step 4.
- `/metrics` --> This exposes all Prometheus Metrics of Sentinel (eg: http://localhost:8080/metrics)
- `/health` --> This can be used as the health endpoint of Sentinel (eg: http://localhost:8080/health)

### Monitoring metrics in Prometheus and Grafana

For this, you need a Prometheus setup in your environment. You can visualise metrics in Prometheus using Grafana or any applicable tool used in your environment. Configure Prometheus to scrape from Sentinel via path `/metrics`. If this is running on your local machine: `http://localhost:8080/metrics`. (The port will change based in your environment variables).

For each URL probing, the success and failure scenarios are incremented int he below two counters. With each metric, the labels `name` and `url` will be attached (these two values are taken from the configs defined when running Sentinel). 

- `sentinel_probing_up_count` -> This counter will be incremented if the probing is successful on a URL.
- `sentinel_probing_down_count` -> This counter will be incremented if the probing fails on a URL.

# License

**Sentinel** is open-source software distributed under the terms of the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) license.

