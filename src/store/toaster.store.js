const toasterStore = {
    showToaster: false,
    message: '',
    toasterMsg(msg ='', type, time = 2000) {
        this.message = msg;
        if(type === 'error') {

        } else if( type === 'success') {

        } else {
            console.error('Type does not exist')
        }
        this.showToaster = true;
        setTimeout(function() {
            this.message = '';
            this.showToaster = false;
        }, time)
    }
}

export default toasterStore