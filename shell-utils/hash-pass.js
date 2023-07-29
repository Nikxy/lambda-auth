import bcrypt from "bcryptjs";

if(process.argv.length < 3) {
    console.log("Please provide a password to hash");
    process.exit(1);
}
const password = process.argv.slice(2)[0];
const hash = bcrypt.hashSync(password, 10);

console.log(hash);
console.log(bcrypt.compareSync(password, hash));
