// window.onload = function () {

document.getElementById("lbuy").innerText = collectionInfo.title.replace("{name}", collectionInfo.name);
document.getElementById("lsupply").innerText = `Total supply: ${mintInfo.totalSupply.toLocaleString()} NFTs`;
document.getElementById("lprice").innerText = `${mintInfo.price.toFixed(2)}`;
document.getElementById("ldate").innerText = `Pre sale available ${collectionInfo.date}`;

document.getElementById("lnprice").innerText = `${mintInfo.minUnits}`
document.getElementById("ape-max").innerText = `${mintInfo.maxUnits} Max`

document.getElementById("price").innerText = `${(mintInfo.price * mintInfo.minUnits).toFixed(2)}`

if (collectionInfo.socialMedia.discord == "") {
    document.head.insertAdjacentHTML('beforeend', '<style> #social_discord { opacity: 0.5; pointer-events: none; } </style>');
} else document.getElementById("social_discord").href = collectionInfo.socialMedia.discord;
if (collectionInfo.socialMedia.twitter == "") {
    document.head.insertAdjacentHTML('beforeend', '<style> #social_twitter { opacity: 0.5; pointer-events: none; } </style>');
} else document.getElementById("social_twitter").href = collectionInfo.socialMedia.twitter;
// }