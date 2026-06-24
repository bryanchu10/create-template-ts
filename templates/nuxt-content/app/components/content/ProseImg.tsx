export default defineComponent({
    props: {
        src: {
            type: String,
            required: true,
        },
        alt: String,
    },
    setup(props) {
        return () => (
            <img
                alt={props.alt}
                class="my-6 rounded max-w-full"
                src={props.src}
                loading="lazy"
            />
        );
    },
});
