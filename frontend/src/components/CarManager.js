import React, { useState } from 'react';
import GetNumber from '../components/GetNumber';
import ScrapperList from '../components/scrapperList';


const CarManager = () => {

    return (
        <div>
            <GetNumber />
            <ScrapperList />

        </div>
    );
};

export default CarManager;
