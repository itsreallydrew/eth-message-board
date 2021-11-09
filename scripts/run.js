const main = async () => {
	const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
	// funds the contract with ETH
	const waveContract = await waveContractFactory.deploy({
		value: hre.ethers.utils.parseEther('0.1'),
	});
	await waveContract.deployed();
	console.log('Contract address:', waveContract.address);

	// address of person deploying contract -- can store to a variable and have rendered on front end --- this is the person who called the wave function

	let contractBalance = await hre.ethers.provider.getBalance(
		waveContract.address
	);
	console.log(
		'Contract balance:',
		hre.ethers.utils.formatEther(contractBalance)
	);

	// let waveCount;
	// waveCount = await waveContract.getTotalWaves();
	// console.log(waveCount.toNumber());

	let waveTxn = await waveContract.wave('New message!');
	await waveTxn.wait();

	// const [_, randomPerson] = await hre.ethers.getSigners();
	// waveTxn = await waveContract
	// 	.connect(randomPerson)
	// 	.wave('You got a new message!');
	// await waveTxn.wait();

	contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
	console.log(
		'Contract balance:',
		hre.ethers.utils.formatEther(contractBalance)
	);

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
