var patternMatch = (resp, db) => {
    var result = ""
    for(i=0;i<db.length;i++){
        var res = [];
        var re = new RegExp(atob(db[i].base64))
        match = re.exec(resp);
        if(match){ 
            result += db[i].library + ", "
        }
    }    
    return result;

}