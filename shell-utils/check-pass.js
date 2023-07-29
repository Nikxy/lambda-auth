import bcrypt from "bcryptjs";

if(process.argv.length < 4) {
    console.log("Please provide a passwords to check");
    process.exit(1);
}
console.log(process.argv)
const password1 = process.argv.slice(2)[0];
const password2 = process.argv.slice(2)[1];

console.log(bcrypt.compareSync(password1, password2));