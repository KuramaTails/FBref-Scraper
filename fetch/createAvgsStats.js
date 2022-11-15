const avg_model = require("../models/avg_model");

module.exports = {
    async execute(fixtures) {
        let h_avgs = {}
        let a_avgs = {}
        fixtures.filter(match=> {
            h_team = match.match.get('general').homeTeam
            a_team = match.match.get('general').awayTeam
            stats = match.match.get('content').stats
            if (stats) {
                const nstats = []
                const ostats = stats.stats
                ostats.forEach(cat => {
                    let elem = {}
                    elem[cat.title] = {}
                    cat.stats.forEach(subcat => {
                        if (subcat.stats[0] != null || subcat.stats[1] != null) {
                            elem[cat.title][subcat.title] = subcat.stats
                        }
                    });
                    nstats.push(elem)
                });
                if (h_avgs[h_team.name]) {
                    h_avgs[h_team.name].index = h_avgs[h_team.name].index+1
                    let oldstats = h_avgs[h_team.name].stats
                    oldstats.forEach(cat => {
                        Object.keys(cat).forEach(subcat => {
                            Object.keys(cat[subcat]).forEach(as => {
                                let stat
                                if (cat[subcat][as][0]!= null || cat[subcat][as][1]!= null) {
                                    nstats.find(x => {if(Object.keys(x) == subcat) stat=x[subcat][as]})
                                    if (stat!= undefined) {
                                        if (!String(stat[0]).includes('%')) {
                                            if (String(stat[0]).includes('.')) {
                                                cat[subcat][as][0] = (parseFloat(cat[subcat][as][0]) + parseFloat(stat[0])).toFixed(2)
                                                cat[subcat][as][1] = (parseFloat(cat[subcat][as][1]) + parseFloat(stat[1])).toFixed(2)
                                            } else {
                                                cat[subcat][as][0] += parseInt(stat[0])
                                                cat[subcat][as][1] += parseInt(stat[1])
                                            }
                                        } else {
                                        /* cat[subcat][as][0] += stat[0]
                                            cat[subcat][as][1] += stat[1]*/
                                        }
                                    }
                                }
                            })
                        });
                    });
                } else {
                    h_avgs[h_team.name] = {index:1,stats:nstats}
                }
                if (a_avgs[a_team.name]) {
                    a_avgs[a_team.name].index = a_avgs[a_team.name].index+1
                        let oldstats = a_avgs[h_team.name].stats
                        oldstats.forEach(cat => {
                            Object.keys(cat).forEach(subcat => {
                                Object.keys(cat[subcat]).forEach(as => {
                                    let stat
                                    if (cat[subcat][as][0]!= null || cat[subcat][as][1]!= null) {
                                        nstats.find(x => {if(Object.keys(x) == subcat) stat=x[subcat][as]})
                                        if (stat!= undefined) {
                                            if (!String(stat[0]).includes('%')) {
                                                if (String(stat[0]).includes('.')) {
                                                    cat[subcat][as][0] = (parseFloat(cat[subcat][as][0]) + parseFloat(stat[0])).toFixed(2)
                                                    cat[subcat][as][1] = (parseFloat(cat[subcat][as][1]) + parseFloat(stat[1])).toFixed(2)
                                                } else {
                                                    cat[subcat][as][0] += parseInt(stat[0])
                                                    cat[subcat][as][1] += parseInt(stat[1])
                                                }
                                            } else {
                                            /* cat[subcat][as][0] += stat[0]
                                                cat[subcat][as][1] += stat[1]*/
                                            }
                                        }
                                    }
                                })
                            });
                        });
                } else {
                    a_avgs[a_team.name] = {index:1,stats:nstats}
                }
            }
        })  
        await avg_model.findOneAndUpdate({
            _id: '55',
        }, {
            $set: {
                id : '55',
                stats : [h_avgs,a_avgs]
            }
        },
        {
            upsert:true,
        })        
    }
};