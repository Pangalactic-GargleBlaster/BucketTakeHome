# Defect Report Review Web App

## Architecture

For this project I used react, node.js, and sqlite as my core tools.
I chose them because they do the job I needed them to do, they are well documented, they have great tooling, and LLMs have seen lots of examples of their usage.
I used typescript to help readability and, by extension, the coding agents.
For simplicity, the database has a single table with DefectReports. Images are served by the node server and referenced by url.
The backend has 3 endpoints: 

- get_defect_reports() to get a batch of reports for the homepage
- get_defect_report(report_id) to get a single report based on its ID
- record_review(report) to update a defect report with the reviewer's notes and decision.

The frontend is built as a combination of components. I created custom components to display a report's overview, its details, and to filter based on the various fields.
I used URL parameters, wherever reasonable, to facilitate link sharing and history navigation
I mostly stuck to the data model that was suggested, but I added a reference image url field for a feature and I coalesced the status and reviewer decision into a single enum to make bad states unrepresentable.

## Running the app

In case your computer doesn't already have node.js, you'll need to install it. You can do so at [https://nodejs.org/en](https://nodejs.org/en)

To install the dependencies

`cd server`  
`npm install`  
`cd ../client`  
`npm install`  

then, from the root folder, run

`npm run seed-db`
`npm run start`

This will create a sqlite database with synthetic data and start the server. By default it runs on port 3000. If you need to use a different one, set the PORT environment variable. Once the app is running, open the homepage by going to [http://localhost:3000](http://localhost:3000)

## Using the app

Any good UI is intuitive, so try clicking around before reading this.

The homepage shows a list of reports, colored by severity and faded by confidence, so visually you can immediately tell how bad of an issue you're looking at.

On the left side of the page, you can filter based on several fields. For string and enum fields, you get a list of options and you can multi-select them. For the confidence field, you get two sliders to set the minimum and maximum values. For the created at field, you get two datetime pickers. Note that setting a filter automatically updates the URL parameters, so you can share a link with a coworker of the exact view you're looking at, despite the fact that the filters are rendered client-side and thus very fast. For string/enum fields, you can also type a value if it's faster than scrolling to find it.

Once you find the report that you care about, clicking on its card will redirect you to a details page. 

There you can see a side-by-side of the photo that triggered the defect report and a reference photo of what the part looks like when there are no defects. Below that, you get the details of the part you're looking at. The values that may be shared across reports are links to the homepage with matching filter parameters, such that you can see, for example, all reports from the same station. On this page you can also sumbit your review, by typing a note and setting the status. When you click "submit review", your input is saved to the database.

## Future improvements

Relational database implementation was not the focus of this project, so I kept things simple by using a single table. If this was a production app with a lot of datapoints, though, it would be worth it to split the reference image urls and part names to their own table, since those are shared across instances of a given part. Also, if multiple reviews are submitted for a single report and the review history is important to track, a new table will be needed to track reviews. Further, referencing images by file name is eventually going to create conflicts, so I would want to store them in the database as well. Finally, If the app truly needs to run at internet scale, then we'd need to implement database sharding, load balancing, and server monitoring.

On the backend side, I would want to implement authentication, batching, instrument the api endpoints to get usage and timing metrics, and add unit tests. I would also need to implement database-level filtering to support batching, otherwise the size of the batches would be inconsistent post-filtering.

On the frontend side, I would spend some time tuning alignment and component sizing based on user feedback, I would experiment with an A/B boundary slider for the reference image comparison feature, and I would add translation support if non-english speakers need to use the app. It might also be useful to be able to filter by prefix rather than exact match, for example on the part name.

## Edge cases I tested for

- SQL injection
- Filtering to the point that no reports match
- Restarting the web server should not lose data
- Empty reviewer note
- Submitting a review with status=unreviewed
- Small screen support



## Edge cases to test

- 1000000 records. I already know I didn't optimize for this, but I don't know when the system will fail
- Corrupted data should not crash the app
- A slow internet connection should not make the app unusable. Same goes for a slow device.



## Fun fact about the images

I spent a few days in Bodie, CA, an abandoned 19th century mining town. The images in the app are photos I took of the random artifact that are left there.