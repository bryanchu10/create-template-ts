export default defineComponent({
    props: {
        src: { type: String, required: true as const },
        alt: String,
    },
    setup(props) {
        return () => <img class="my-6 rounded max-w-full" loading="lazy" src={props.src} alt={props.alt} />;
    },
});
