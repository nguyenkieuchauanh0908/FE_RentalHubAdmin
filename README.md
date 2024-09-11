# Introduction
- This repo is for one of three websites included in my graduation thesis (Basically, it's a platform where people go to search for rental apartments. There are three main roles: Users/Hosts who are looking for rental flats or rental homeowners who want to let apartment seekers know of their places. The management roles are inspector and admin with the main functions to sensor posts from hosts).
- The other repo for the user website can be found here <a href='https://github.com/nguyenkieuchauanh0908/RentalHubFE'>Customers</a>, <a href='https://github.com/nguyenkieuchauanh0908/FE_RentalHubInspector'>Inspectord</a>
- Before cloning and running this repo, make sure to clone and run the <a href='https://github.com/nguyenkieuchauanh0908/RentalHubBE'>backend server</a>
- You can also find the demo video <a href='https://youtu.be/-Bspym1C5Fw'>here</a>

# Installation
- To run this repo, follow the steps:
 1. Clone this repo and open the terminal (make sure the directories point to the project included in this repo)
 2. Open the project and run <pre><code>npm install</code></pre> to install all necessary libraries or packages. In case there are any warnings due to deprecated versions of some libraries, you can also run <code>npm install --force</code></pre> and ignore them (I use some no-fee-charging libraries that are slow to update with the latest angular versions. Please ignore those warnings cause they would work fine at least with this angular version)
 3. Run <pre><code>ng serve --port 4200</code></pre> (You can also run on port 4201 or 4202 as long as they must not be duplicated if you run more than two front-end servers at the same time )
 4. Open the browser at http://localhost:4200/ (or http://localhost:4201/ or http://localhost:4202/ with 4200/4201/4202 are the port of your choice)

 # Testing Account
6.  Demo account for users
    - email: duyen2k2@yopmail.com
    - password: duyen59@
 7. Demo account for admin:
    - email: 20110234@student.hcmute.edu.vn
    - password: chauanh@123
 8. Demo account for inspector:
    - email: hoangvu@yopmail.com
    - password: duyen59@
9. Demo VNPay account <a href='https://sandbox.vnpayment.vn/apis/vnpay-demo/'>here</a>
