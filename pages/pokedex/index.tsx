'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AxiosRequetsPokedex from '../../components/AxiosRequetsPokedex';

const pokédex = () => {
	return (
		<>
			<AxiosRequetsPokedex />
		</>
	);
};
export default pokédex;
