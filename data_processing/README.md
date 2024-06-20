# TO DO

- download cities.csv from Github repo

  - get only TR cities
  - get only necessary columns
  - Replace `Hakkari` with `Hakkari`

- generate filtered_output5.tsv from planet-scale OSM names data using bash script

  - get only cities do not belong to TR
  - filter out unnecessary columns in the bash script in GPS-miner repo!

- merge 2 data files and create a singular TSV file which will be simply the database. (Let's name the file as "DB.tsv")

- test the DB if it stores all things correctly
  - check all Turkish cities and states
  - check some random cities such as "Ulaanbaatar"
  - check number of states and cities in each country

- create an index file from the DB to find an entry in O(1) time

- create Trie by reading the DB and putting pointers to the DB entry using index file
    - for each weird character such as: "ç", "ö" ... add also it's English mapping in the Trie structure
    - gzip Trie data file if it's big

- read gzip file and then implement the search function