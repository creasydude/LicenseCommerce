const Otp = () => {
    const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
    return numbers[Math.floor(Math.random() * 9)] + numbers[Math.floor(Math.random() * 9)] + numbers[Math.floor(Math.random() * 9)] + numbers[Math.floor(Math.random() * 9)];
}

export default Otp;