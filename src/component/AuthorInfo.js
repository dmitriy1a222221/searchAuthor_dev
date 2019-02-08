import React from 'react';
import firstMed from '../img/medals/1.svg';
import secondMed from '../img/medals/2.svg';
import threeMed from '../img/medals/3.svg';
import noMed from '../img/medals/4.svg';

const AuthorInfo = ({classNameNew, orderNum, name, countPub, pageviews, colorRandom}) => {
    let classWrap = `AuthorInfo ${classNameNew.bgItem} ${classNameNew.medalToggle}`;
    let img;
    switch (orderNum) {
        case 1:
            img = firstMed;
            break;
        case 2:
            img = secondMed;
            break;
        case 3:
            img = threeMed;
            break;
        default:
            img = noMed
    }
    return (
        <div className= {classWrap}>
            <div className="main-author-inf">
                <span className="order-num">{orderNum}</span>
                <div className="avatar" style={{backgroundColor: colorRandom}}>
                    <span>{name.charAt(0)}</span>
                </div>
                <div>
                    <p className="author-name">
                        {name}
                    </p>
                    <span className="publication">
                    {countPub} публ.
                </span>
                </div>
            </div>
            <img src={img} alt="medal" className="medal"/>
            <p className="page-view">
                {String(pageviews).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')}
            </p>
        </div>
    );
}

export default AuthorInfo;
