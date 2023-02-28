const {DataStore} = require('aws-amplify');
const {ApplicationSearchRecord, Application} = require('./models')

async function updateApplicationSearchEntities() {
    const searchableItems = await DataStore.query(ApplicationSearchRecord);
    const applications = await DataStore.query(Application);

    for (const item of searchableItems) {
        for (const app of applications) {
            if(item.id == app.id) {
            
                let guestsFirstNames = []
                let guestsLastNames = []
                if(app.Guests != null) {
                    for(const guest of app.Guests) {
                        guestsFirstNames.push(guest.first_name);
                        guestsLastNames.push(guest.last_name);
                    }
                }

                await DataStore.save(ApplicationSearchRecord.copyOf(original, updated=> {
                    updated.serviceMemberFirstName = app.serviceMemberFirstName;
                    updated.serviceMemberLastName = app.serviceMemberLastName;
                    updated.guestFirstNames = guestsFirstNames;
                    updated.guestLastNames = guestsLastNames;
                }));
        
            }

        }
    }

}

updateApplicationSearchEntities().then(()=>{console.log("migration complete.")})