# eForms SDK Documentation

Please use the [**TED Developer Docs**](https://docs.ted.europa.eu/) portal if you want to read the eForms SDK Documentation.

This Github repository is only used for authoring the SDK documentation and maintaining its different versions.\
The eForms SDK Documentation is written in AsciiDoc, following the docs-as-code paradigm. 

## How this repository is organised
For each version of the eForms SDK, a separate branch is maintained in this repository containing the sources
of the documentation of the respective version of SDK. 
This allows us to retrospectively fix errors in previous versions of the SDK documentation (fixing broken links for example).

Branch names indicate only the major and minor version number of the eForms SDK to the documentation of which their content corresponds.
The documentation of the latest revision of each minor version of the SDK is always available to you in the  [**TED Developer Docs**](https://docs.ted.europa.eu/) portal.  

The main branch of this repository is used exclusively for authoring "un-versioned" documents that complement the eForms SDK documentation. Such "version-less" documents are for example the eForms FAQ, the SDK RoadMap, or other similar in nature content.

## Workspace Setup

### VSCode installation

1. Install "Visual Studio Code" from EC Store.
2. Start "Visual Store Code [V5]" (if it is already running, restart it).

From within VSCode:

1. Configure proxy for VS Code and terminal:
   1. Open "View > Command Palette..." and select "Preferences: Open Settings (JSON)".
   2. Add or edit (if they already exist) the following lines, replacing values between "<" and ">":

      ```json
      "http.proxy": "http://<username:<password>@<proxy_host>:<proxy_port>",
      "terminal.integrated.env.windows": {
        "http_proxy": "http://<username:<password>@<proxy_host>:<proxy_port>",
        "https_proxy": "http://<username:<password>@<proxy_host>:<proxy_port>"
      }
      ```

> **NOTE**: When editing "settings.json", make sure that the resulting JSON is valid by fixing any warnings/errors that might appear.
