import bcrypt from "bcryptjs";

if(process.argv.length < 3) {
    console.log("Please provide a password to hash");
    process.exit(1);
}
const password = process.argv.slice(2)[0];
console.log(bcrypt.hashSync(password, 10));