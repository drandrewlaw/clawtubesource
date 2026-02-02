// Native fetch is available in Node 18+
async function main() {
  try {
    const imageUrl = 'https://placehold.co/600x400/1e293b/475569.png?text=STREAM+SIGNAL';
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log(buffer.toString('base64'));
  } catch (err) {
    console.error(err);
  }
}

main();
