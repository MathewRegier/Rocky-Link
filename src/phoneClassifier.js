// phoneClassifier.js

const phoneData = {
    landline: {
        "1226216": { provider: "Distributel", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226221": { provider: "TELUS Integrated Communications", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226315": { provider: "Distributel", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226356": { provider: "TELUS Integrated Communications", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226526": { provider: "Fibernetics Corporation", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226674": { provider: "Managed Network Systems Inc.", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226773": { provider: "Iristel Inc.", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226774": { provider: "Iristel Inc.", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226782": { provider: "Iristel Inc.", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226783": { provider: "Iristel Inc.", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226826": { provider: "TELUS Integrated Communications", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226946": { provider: "Fibernetics Corporation", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226375": { provider: "Gosfield North Communication Co-operative Ltd.", location: "Pleasant Park", province: "ON", distance: "Within 1 Hour" },
        "1226409": { provider: "Gosfield North Communication Co-operative Ltd.", location: "Belle River", province: "ON", distance: "Within 1 Hour" },
        "1226846": { provider: "Brooke Telecom Co-operative Ltd.", location: "Alvinston", province: "ON", distance: "Within 2 Hours" },
        "1519250": { provider: "Bell Canada", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519251": { provider: "Bell Canada", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519252": { provider: "Bell Canada", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519253": { provider: "Bell Canada", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519254": { provider: "Bell Canada", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519256": { provider: "Bell Canada", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519257": { provider: "Bell Canada", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519258": { provider: "Bell Canada", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519259": { provider: "Bell Canada", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519436": { provider: "Bell Canada", location: "Chatham", province: "ON", distance: "Within 1 Hour" },
        "1519437": { provider: "Bell Canada", location: "Chatham", province: "ON", distance: "Within 1 Hour" },
        "1519560": { provider: "Bell Canada", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519561": { provider: "Bell Canada", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519563": { provider: "Bell Canada", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519966": { provider: "Bell Canada", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519967": { provider: "Bell Canada", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519969": { provider: "Bell Canada", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519971": { provider: "Bell Canada", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519972": { provider: "Bell Canada", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519973": { provider: "Bell Canada", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519974": { provider: "Bell Canada", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519985": { provider: "Bell Canada", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519987": { provider: "Bell Canada", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519988": { provider: "Bell Canada", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519326": { provider: "Bell Canada", location: "Leamington", province: "ON", distance: "Within 1 Hour" },
        "1519325": { provider: "Bell Canada", location: "Leamington", province: "ON", distance: "Within 2 Hours" },
        "1519237": { provider: "Hay Communications Co-operative Ltd.", location: "Dashwood", province: "ON", distance: "Within 2 Hours" },
        "1519238": { provider: "Hay Communications Co-operative Ltd.", location: "Grand Bend", province: "ON", distance: "Within 2 Hours" },
        "1519246": { provider: "Bell Canada", location: "Strathroy", province: "ON", distance: "Within 2 Hours" },
        "1519268": { provider: "Bell Canada", location: "Dorchester", province: "ON", distance: "Within 2 Hours" },
        "1519285": { provider: "Bell Canada", location: "Thamesford", province: "ON", distance: "Within 2 Hours" }
    },
    cellphone: {
        "1226229": { provider: "Rogers", location: "Chatham", province: "ON", distance: "Within 1 Hour" },
        "1226246": { provider: "Freedom Mobile Inc.", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226260": { provider: "Freedom Mobile Inc.", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226280": { provider: "Rogers Communications Canada Inc. (Wireless)", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226340": { provider: "TELUS Mobility", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226344": { provider: "TELUS Mobility", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226345": { provider: "TELUS Mobility", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226346": { provider: "TELUS Mobility", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226347": { provider: "TELUS Mobility", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226348": { provider: "TELUS Mobility", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226350": { provider: "TELUS Mobility", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226365": { provider: "TELUS Mobility", location: "Chatham", province: "ON", distance: "Within 1 Hour" },
        "1226935": { provider: "Rogers Communications Canada Inc. (Wireless)", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226975": { provider: "Fido Solutions Inc.", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226506": { provider: "Freedom Mobile Inc.", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226542": { provider: "Bell Mobility", location: "Chatham", province: "ON", distance: "Within 1 Hour" },
        "1226626": { provider: "Telus Mobility", location: "Chatham", province: "ON", distance: "Within 1 Hour" },
        "1226627": { provider: "Telus Mobility", location: "Chatham", province: "ON", distance: "Within 1 Hour" },
        "1226724": { provider: "Bell Mobility", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226739": { provider: "Freedom Mobile Inc.", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226757": { provider: "Bell Mobility", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226758": { provider: "Bell Mobility", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226759": { provider: "Bell Mobility", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226787": { provider: "Bell Mobility", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226788": { provider: "Bell Mobility", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226881": { provider: "Fido Solutions Inc.", location: "Chatham", province: "ON", distance: "Within 1 Hour" },
        "1226961": { provider: "Fido Solutions Inc.", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226260": { provider: "Freedom Mobile Inc.", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226343": { provider: "TELUS Mobility", location: "Guelph", province: "ON", distance: "Within 2 Hours" },
        "1226401": { provider: "Bell Mobility", location: "Chatham", province: "ON", distance: "Within 1 Hour" },
        "1226404": { provider: "Rogers Communications Canada Inc. (Wireless)", location: "Chatham", province: "ON", distance: "Within 1 Hour" },
        "1226505": { provider: "Freedom Mobile Inc.", location: "Kitchener-Waterloo", province: "ON", distance: "Within 2 Hours" },
        "1519300": { provider: "Bell Mobility", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519350": { provider: "Rogers Communications Canada Inc. (Wireless)", location: "Chatham", province: "ON", distance: "Within 1 Hour" },
        "1519359": { provider: "Bell Mobility", location: "Chatham", province: "ON", distance: "Within 1 Hour" },
        "1519562": { provider: "Rogers Communications Canada Inc. (Wireless)", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519551": { provider: "Rogers Communications Canada Inc. (Wireless)", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519564": { provider: "TELUS Mobility", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519566": { provider: "Rogers Communications Canada Inc. (Wireless)", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519567": { provider: "Rogers Communications Canada Inc. (Wireless)", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519613": { provider: "Bell Mobility", location: "Leamington", province: "ON", distance: "Within 1 Hour" },
        "1519716": { provider: "Bell Mobility", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519791": { provider: "Telus Mobility", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519796": { provider: "Telus Mobility", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519817": { provider: "Rogers Communications Canada Inc. (Wireless)", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519809": { provider: "Telus Mobility", location: "Chatham", province: "ON", distance: "Within 1 Hour" },
        "1519816": { provider: "TELUS Mobility", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519817": { provider: "TELUS Mobility", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519818": { provider: "TELUS Mobility", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519819": { provider: "TELUS Mobility", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519890": { provider: "TELUS Mobility", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519903": { provider: "Rogers Communications Canada Inc. (Wireless)", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519941": { provider: "Bell Canada", location: "Orangeville", province: "ON", distance: "Within 30 Minutes" },
        "1519965": { provider: "Bell Mobility", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519981": { provider: "Bell Mobility", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519982": { provider: "Bell Mobility", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519984": { provider: "Bell Mobility", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519990": { provider: "TELUS Mobility", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519991": { provider: "Fido Solutions Inc.", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519992": { provider: "Fido Solutions Inc.", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519995": { provider: "Bell Mobility", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519996": { provider: "Bell Mobility", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519999": { provider: "TELUS Mobility", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519329": { provider: "Rogers Communications Canada Inc. (Wireless)", location: "Leamington", province: "ON", distance: "Within 1 Hour" }
    },
    voip: {
        "1226703": { provider: "Iristel Inc.", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226704": { provider: "Iristel Inc.", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226708": { provider: "Iristel Inc.", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226722": { provider: "Primus Telecommunications Canada Inc.", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226769": { provider: "IXICA Communications Inc.", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226803": { provider: "Iristel Inc.", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226804": { provider: "Iristel Inc.", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226805": { provider: "Iristel Inc.", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226822": { provider: "InnSysVoice Corp", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226824": { provider: "TELUS Integrated Communications", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226834": { provider: "Comwave Networks", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226840": { provider: "Iristel Inc.", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1226202": { provider: "Fido Solutions Inc.", location: "Leamington", province: "ON", distance: "Within 1 Hour" },
        "1226205": { provider: "TELUS Integrated Communications", location: "Chatham", province: "ON", distance: "Within 1 Hour" },
        "1226207": { provider: "TELUS Integrated Communications", location: "Harrow", province: "ON", distance: "Within 1 Hour" },
        "1226247": { provider: "TELUS Integrated Communications", location: "McGregor", province: "ON", distance: "Within 1 Hour" },
        "1226248": { provider: "TELUS Integrated Communications", location: "Wheatley", province: "ON", distance: "Within 1 Hour" },
        "1226252": { provider: "Zayo Canada Inc.", location: "Maidstone", province: "ON", distance: "Within 30 Minutes" },
        "1226256": { provider: "Iristel Inc.", location: "Leamington", province: "ON", distance: "Within 1 Hour" },
        "1226407": { provider: "Iristel Inc.", location: "Belmont", province: "ON", distance: "Within 2 Hours" },
        "1226445": { provider: "Bragg Communications Inc.", location: "Mount Forest", province: "ON", distance: "Within 3 Hours" },
        "1226478": { provider: "ISP Telecom Inc.", location: "Belle River", province: "ON", distance: "Within 1 Hour" },
        "1226482": { provider: "ISP Telecom Inc.", location: "McGregor", province: "ON", distance: "Within 1 Hour" },
        "1226485": { provider: "ISP Telecom Inc.", location: "Woodslee", province: "ON", distance: "Within 30 Minutes" },
        "1226494": { provider: "ISP Telecom Inc.", location: "Chatham", province: "ON", distance: "Within 1 Hour" },
        "1226527": { provider: "Distributel", location: "St. Jacobs", province: "ON", distance: "Within 3 Hours" },
        "1226632": { provider: "Comwave Networks", location: "Breslau", province: "ON", distance: "Within 2 Hours" },
        "1226634": { provider: "TekSavvy Solutions Inc.", location: "Kingsville", province: "ON", distance: "Within 1 Hour" },
        "1226638": { provider: "TekSavvy Solutions Inc.", location: "Leamington", province: "ON", distance: "Within 1 Hour" },
        "1226707": { provider: "InnSysVoice Corp", location: "Chatham", province: "ON", distance: "Within 1 Hour" },
        "1226738": { provider: "TELUS Integrated Communications", location: "Petrolia", province: "ON", distance: "Within 1 Hour" },
        "1226807": { provider: "Iristel Inc.", location: "Hespeler", province: "ON", distance: "Within 2 Hours" },
        "1226837": { provider: "TELUS Integrated Communications", location: "Highgate", province: "ON", distance: "Within 1 Hour" },
        "1226843": { provider: "InnSysVoice Corp", location: "Leamington", province: "ON", distance: "Within 1 Hour" },
        "1226845": { provider: "InnSysVoice Corp", location: "Tecumseh", province: "ON", distance: "Within 30 Minutes" },
        "1226854": { provider: "InnSysVoice Corp", location: "Ayr", province: "ON", distance: "Within 3 Hours" },
        "1226877": { provider: "InnSysVoice Corp", location: "Amherstburg", province: "ON", distance: "Within 30 Minutes" },
        "1226878": { provider: "InnSysVoice Corp", location: "Petrolia", province: "ON", distance: "Within 1 Hour" },
        "1226967": { provider: "TekSavvy Solutions Inc.", location: "Wardsville", province: "ON", distance: "Within 2 Hours" },
        "1226997": { provider: "InnSysVoice Corp", location: "Kingsville", province: "ON", distance: "Within 1 Hour" },
        "1519800": { provider: "Iristel Inc.", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519946": { provider: "Zayo Canada Inc.", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519968": { provider: "TELUS Integrated Communications", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519989": { provider: "Rogers Communications Canada Inc. (Cable)", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519997": { provider: "Primus Telecommunications Canada Inc.", location: "Windsor", province: "ON", distance: "Within 30 Minutes" },
        "1519398": { provider: "TELUS Integrated Communications", location: "Leamington", province: "ON", distance: "Within 1 Hour" },
        "1519712": { provider: "TELUS Integrated Communications", location: "Kingsville", province: "ON", distance: "Within 1 Hour" }
    }
};

export function classifyPhoneNumber(number) {
    // Ensure the number is a string and prepend a '+' if it doesn't already have one
    if (typeof number !== 'string') {
        number = String(number);
    }
    if (number.startsWith('+')) {
        number = number.substring(1);
    }

    const isLandline = (number) => {
        for (let prefix in phoneData.landline) {
            if (number.startsWith(prefix)) {
                return { type: "Landline", ...phoneData.landline[prefix] };
            }
        }
        return null;
    };

    const isCellPhone = (number) => {
        for (let prefix in phoneData.cellphone) {
            if (number.startsWith(prefix)) {
                return { type: "CellPhone", ...phoneData.cellphone[prefix] };
            }
        }
        return null;
    };

    const isVoIP = (number) => {
        for (let prefix in phoneData.voip) {
            if (number.startsWith(prefix)) {
                return { type: "VoIP", ...phoneData.voip[prefix] };
            }
        }
        return null;
    };

    let result = isCellPhone(number) || isVoIP(number) || isLandline(number);
    if (result) {
        result.phoneDetermination = result.location.includes("Windsor") ? "Windsor" : "Surrounding Windsor";
        return result;
    } else {
        console.log(number);
        return { type: "Unclassified", provider: "Unknown", location: "Unknown", province: "Unknown", distance: "Unknown", phoneDetermination: "Unknown" };
    }
}
