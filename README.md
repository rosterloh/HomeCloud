# HomeCloud [![Dependency Status](https://david-dm.org/rosterloh/HomeCloud.svg?style=flat-square)](https://david-dm.org/rosterloh/HomeCloud) [![devDependency Status](https://david-dm.org/rosterloh/HomeCloud/dev-status.svg?style=flat-square)](https://david-dm.org/rosterloh/HomeCloud#info=devDependencies)

## Configuring development
Setting up authorisation to your development machine
```bash
$ gcloud auth login
$ gcloud components update app
$ gcloud config set project <your-project-id>
```

## Create a Cloud Storage Bucket for your project
Cloud Storage allows you to store and serve binary data. A bucket is a high-level container for binary objects.
```bash
$ gsutil mb gs://<your-project-id>
$ gsutil defacl set public-read gs://<your-project-id>
```

## Running Locally
```bash
$ gcloud [--verbosity debug] preview app run app.yaml
```

## Deploying
```bash
$ gcloud --project YOUR-PROJECT-NAME-HERE preview app deploy app.yaml
```

## Typings
```bash
$ tsd update -so
```

## More info
* [gcloud-node](https://github.com/GoogleCloudPlatform/gcloud-node)
* [Google Cloud Platform Docs](https://cloud.google.com/nodejs/)
