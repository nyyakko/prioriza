export default function roundToXDigits(value: number, digits: number)
{
    value = value * Math.pow(10, digits);
    value = Math.round(value);
    value = value / Math.pow(10, digits);
    return value;
}
