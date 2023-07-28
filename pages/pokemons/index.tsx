'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AxiosRequets from '../../components/Inutile/AxiosRequets';
import AGGrid from '../../components/AGGrid';

const pokemon = () => {
	return (
		<>
			<AxiosRequets />
			<AGGrid />
		</>
	);
};
export default pokemon;
