function uploadFile(data) {

const { files } = data.dataTransfer;
  if (files.length === 1) {
    let fileToUpload = files[0].name;

//Get Transfer Spec NodeAPI
const object = { 
         "transfer_requests": [
         {
                "transfer_request": {
                "source_root": "/",
                "destination_root": "/",
                "token_life_seconds": 43200,
                "paths": [
                {
                        "source": fileToUpload
                }
        ]
      }
    }
  ]

};
const url = 'https://<ASPERA NODE URL>/files/upload_setup';
fetch(
    url,
    {
        headers: { "Content-Type": "application/json", "accept": "application/json", "Authorization": "Basic <INSERT YOUR BASIC AUTH TOKEN>" },
        method: "POST",
        body: JSON.stringify(object)
    }
)
    .then(response => response.json())
    .then(json => {
	      var obj=json.transfer_specs[0].transfer_spec;
	      const authmethodjson = {authentication: 'token'};
// Need to add 'authentication' to the transfer spec obtained from NodeAPI.
	      var transferspec = Object.assign({}, authmethodjson, obj);
	      console.log(transferspec);
              this.client.startTransfer(transferspec);
      })
	.catch(() => {
      console.error('Not Good JSON');
	});
  }
}

function upload() {
  /**
   * Display a file browser for the user to select a file.
   */
  const options = {
    allowMultipleSelection: false
  };

  this.client.showSelectFileDialogPromise(options)
    .then(uploadFile)
    .catch(() => {
      console.error('Unable to select files');
    });
}

function initAsperaConnect() {
  this.client = new AW4.Connect();
  this.client.initSession();
}

