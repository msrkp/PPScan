var patternMatch = (resp, db) => {
    var result = ""
    for(i=0;i<db.length;i++){
        var res = [];
        var re = new RegExp(db[i].pattern)
        match = re.exec(resp);
        if(match){ 
            result += db[i].library + ", "
        }
    }    
    return result;

}