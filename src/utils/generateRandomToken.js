import crypto from 'crypto';

export default function(length = 32) {
    return crypto.randomBytes(length/2).toString("hex");
}