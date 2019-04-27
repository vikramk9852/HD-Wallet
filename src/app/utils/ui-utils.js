
class UIUtils {

    static showLoader(screen) {
        screen.state.showLoading = true;
        return new Promise((resolve,reject)=>{
           setTimeout(()=>{
               resolve();
           })
        },500);
    }
}

  
module.exports = UIUtils;