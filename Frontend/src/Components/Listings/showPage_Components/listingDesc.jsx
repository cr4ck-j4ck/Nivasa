export default function({listingObj}){
    return(
        <h3>{listingObj ? listingObj.roomType :"Loading.."} in {listingObj ? listingObj.location.city :"Loading.."}</h3>
    );
}