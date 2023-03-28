import alpineWebflow from "./modules/alpine-webflow";
import Alpine from 'alpinejs';

window.documentTypes = {
    notes: "Notes",
    recommendations: "Conseils patient",
    prescriptions: "Ordonnance"
}

window.Alpine = Alpine;

// document.addEventListener('load', init);

async function init() {
    console.log("Inside memberstack check")
    const user = await memberstack.instance.getCurrentMember();

    if (!user.data) {
        memberstack.instance.openModal('LOGIN').then(({data}) => {
            memberstack.instance.hideModal();
            console.log(data)
        });
    } else {
        console.log('Auth checked')
    }
}


document.addEventListener('alpine:init', () => {
    console.log('inside Alpine init...')
    const memberToken = memberstack.instance.getMemberCookie();

    Alpine.store('documentsStore', {
        documents: [],
        async init() {
            this.documents = await this.getDocuments()
        },
        async getDocuments() {
            const response = await fetch('https://api.ordotype.fr/v1.0.0/notes?page=1&limit=10&sort=created_on&direction=DESC', {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${memberToken}`,
                }
            })
            const documents = await response.json();
            return documents['notes'];
        },
    })

    Alpine.data('documentsDataTable', () => ({
        textTitle(d) {
            return {
                ['x-text']: 'd.title'
            }
        },
        textType(d) {
            return {
                ['x-text']: 'window.documentTypes[d.type]'
            }
        },
        textDate(d) {
            return {
                ['x-text']: 'new Date(d.updated_on).toLocaleDateString(\'fr-FR\')'
            }
        },
    }))
})

if (!window.Webflow) {
    window.Webflow = []
}
window.Webflow.push(() => {
    init().then(() => {
            alpineWebflow()
            Alpine.start()
        }
    )
})
