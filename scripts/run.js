const main = async () => {
	const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
	const waveContract = await waveContractFactory.deploy();
	await waveContract.deployed();
	console.log('Contract address:', waveContract.address);

	// address of person deploying contract -- can store to a variable and have rendered on front end --- this is the person who called the wave function

	let waveCount;
	waveCount = await waveContract.getTotalWaves();
	console.log(waveCount.toNumber());

	let waveTxn = await waveContract.wave('New message!');
	await waveTxn.wait();

	const [_, randomPerson] = await hre.ethers.getSigners();
	waveTxn = await waveContract
		.connect(randomPerson)
		.wave('You got a new message!');
	await waveTxn.wait();

	let allWaves = await waveContract.getAllWaves();
	console.log(allWaves);
};

const runMain = async () => {
	try {
		await main();
		process.exit(0);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};

runMain();
