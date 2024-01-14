// App.js
import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import JSZip from 'jszip';
import CouponCodeGenerator from './CouponCodeGenerator';
import Codes from './Codes';

const App = () => {

  return (
    <div className="container mx-auto mt-8">
      <CouponCodeGenerator />
    </div>
  );
};

export default App;
