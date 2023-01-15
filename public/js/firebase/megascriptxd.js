/*

geonameid         : integer id of record in geonames database
name              : name of geographical point (utf8) varchar(200)
asciiname         : name of geographical point in plain ascii characters, varchar(200)
alternatenames    : alternatenames, comma separated, ascii names automatically transliterated, convenience attribute from alternatename table, varchar(10000)
latitude          : latitude in decimal degrees (wgs84)
longitude         : longitude in decimal degrees (wgs84)
feature class     : see http://www.geonames.org/export/codes.html, char(1)
feature code      : see http://www.geonames.org/export/codes.html, varchar(10)
country code      : ISO-3166 2-letter country code, 2 characters
cc2               : alternate country codes, comma separated, ISO-3166 2-letter country code, 200 characters
admin1 code       : fipscode (subject to change to iso code), see exceptions below, see file admin1Codes.txt for display names of this code; varchar(20)
admin2 code       : code for the second administrative division, a county in the US, see file admin2Codes.txt; varchar(80) 
admin3 code       : code for third level administrative division, varchar(20)
admin4 code       : code for fourth level administrative division, varchar(20)
population        : bigint (8 byte int) 
elevation         : in meters, integer
dem               : digital elevation model, srtm3 or gtopo30, average elevation of 3''x3'' (ca 90mx90m) or 30''x30'' (ca 900mx900m) area in meters, integer. srtm processed by cgiar/ciat.
timezone          : the iana timezone id (see file timeZone.txt) varchar(40)
modification date : date of last modification in yyyy-MM-dd format

*/

class Location {
    constructor(geonameid, _name, alternate_names, latitude, longitude, feature_class, feature_code, country_code,
        cc2, admin1_code, admin2_code, admin3_code, admin4_code, population, elevation, dem, timezone, modification_date) {
        this.geonameid = geonameid;
        this._name = _name;
        this.alternate_names = alternate_names;
        this.latitude = latitude;
        this.longitude = longitude;
        this.feature_class = feature_class;
        this.feature_code = feature_code;
        this.country_code = country_code;
        this.cc2 = cc2;
        this.admin1_code = admin1_code;
        this.admin2_code = admin2_code;
        this.admin3_code = admin3_code;
        this.admin4_code = admin4_code;
        this.population = population;
        this.elevation = elevation;
        this.dem = dem;
        this.timezone = timezone;
        this.modification_date = modification_date;
    }
}

async function readFileToObject() {
    const [file] = document.querySelector('input[type=file]').files;
    const headers = ['geonameid', 'name', 'asciiname', "alternatenames", "latitude", "longitude", "feature_class",
        "feature_code", "country_code", "cc2", "admin1_code", "admin2_code", "admin3_code",
        "admin4_code", "population", "elevation", "dem", "timezone", "modification_date"];

    Papa.parse(file, {
        delimiter: '\t',
        dynamicTyping: true,
        complete: function (results) {
            // fazer collectionRef aqui para ao percorrer p/array
            // nao perder tempo a ir buscar a colecao
            var collectionRef = firebase.firestore().collection("api");

            var added = 0;
            results.data.forEach(function (data) {
                let obj = {};
                headers.forEach((header, index) => {
                    obj[header] = data[index];
                });
                collectionRef.add(obj)
                    .then(function (docRef) {
                        added++;
                        console.log(`${Math.floor((added / results.data.length) * 100)}% adicionado`);
                    })
                    .catch(function (error) {
                        console.error("erro: ", error);
                    });
            });
        }
    });
}

async function betterReadFileToObject() {
    const [file] = document.querySelector('input[type=file]').files;
    const headers = ['geonameid', 'name', 'asciiname', "alternatenames", "latitude", "longitude", "feature_class",
        "feature_code", "country_code", "cc2", "admin1_code", "admin2_code", "admin3_code",
        "admin4_code", "population", "elevation", "dem", "timezone", "modification_date"];
    const filters = ['MT', 'MTS', 'CNYN', 'HLL', 'HLLS', 'NTK', 'NTKS', 'PK' , 'PKS']
    
    Papa.parse(file, {
        delimiter: '\t',
        dynamicTyping: true,
        complete: function(results) {
            // fazer collectionRef aqui para ao percorrer p/array
            // nao perder tempo a ir buscar a colecao
            var collectionRef = firebase.firestore().collection("api");

            // Filter the data to only include objects with feature_class of filters
            const filteredData = results.data.filter(data => filters.includes(data[7]));
            let total = filteredData.length;
            let current = 0;

            // Add the filtered data to the collection
            filteredData.forEach(function(data) {
                let obj = {};
                headers.forEach((header, index) => {
                    obj[header] = data[index];
                });
                collectionRef.add(obj)
                    .then(function(docRef) {
                        current++;
                        console.log(`${current}/${total} added to firebase`);
                        console.log(`${(current / total * 100).toFixed(2)}% completed`);
                    })
                    .catch(function(error) {
                        console.error("erro: ", error);
                    });
            });
        }
    });
}
/**/