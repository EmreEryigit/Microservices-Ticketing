import { Button, createStyles, TextInput } from "@mantine/core";
import Router from "next/router";
import { FormEvent, useState } from "react";
import useRequest from "../../hooks/use-request";

const useStyles = createStyles(
    (theme, { floating }: { floating: boolean }) => ({
        root: {
            position: "relative",
        },

        label: {
            position: "absolute",
            zIndex: 2,
            top: 7,
            left: theme.spacing.sm,
            pointerEvents: "none",
            color: floating
                ? theme.colorScheme === "dark"
                    ? theme.white
                    : theme.black
                : theme.colorScheme === "dark"
                ? theme.colors.dark[3]
                : theme.colors.gray[5],
            transition:
                "transform 150ms ease, color 150ms ease, font-size 150ms ease",
            transform: floating
                ? `translate(-${theme.spacing.sm}px, -28px)`
                : "none",
            fontSize: floating ? theme.fontSizes.xs : theme.fontSizes.sm,
            fontWeight: floating ? 500 : 400,
        },

        required: {
            transition: "opacity 150ms ease",
            opacity: floating ? 1 : 0,
        },

        input: {
            "&::placeholder": {
                transition: "color 150ms ease",
                color: !floating ? "transparent" : undefined,
            },
        },
    })
);

const NewTicket = () => {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");

    const [focused, setFocused] = useState(false);
    const [focusedprice, setFocusedPrice] = useState(false);
    const { doRequest, errors } = useRequest({
        url: "/api/tickets",
        method: "post",
        body: {
            title,
            price,
        },
        onSuccess: () => Router.push("/"),
    });

    const blurHandler = () => {
        const value = parseFloat(price);
        if (isNaN(value)) {
            return;
        }

        setPrice(value.toFixed(2));
    };

    const submitHandler = (event: FormEvent) => {
        event.preventDefault();

        doRequest();
    };
    const { classes } = useStyles({
        floating: title.trim().length !== 0 || focused,
    });
    const { classes: classesPrice } = useStyles({
        floating: price.trim().length !== 0 || focusedprice,
    });
    return (
        <div>
            <h1>Create a Ticket</h1>
            <form onSubmit={submitHandler}>
                <div>
                    <TextInput
                        label="Title"
                        placeholder="Enter your ticket title"
                        required
                        classNames={classes}
                        value={title}
                        onChange={(event) =>
                            setTitle(event.currentTarget.value)
                        }
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        mt="md"
                        autoComplete="nope"
                    />
                </div>
                <div>
                    <TextInput
                        label="Price"
                        placeholder="Enter your ticket price"
                        required
                        classNames={classesPrice}
                        value={price}
                        onChange={(event) =>
                            setPrice(event.currentTarget.value)
                        }
                        onFocus={() => setFocusedPrice(true)}
                        onBlur={() => setFocusedPrice(false)}
                        mt="md"
                        autoComplete="nope"
                    />
                </div>
                {errors}
                <Button
                    variant="gradient"
                    styles={(theme) => ({
                        root: {
                            backgroundColor: "#00acee",
                            border: 0,
                            height: 42,
                            paddingLeft: 20,
                            paddingRight: 20,
                            marginTop: 20,

                            "&:hover": {
                                backgroundColor: theme.fn.darken(
                                    "#00acee",
                                    0.05
                                ),
                            },
                        },

                     
                    })}
                    gradient={{ from: "#ed6ea0", to: "#ec8c69", deg: 35 }}
                >
                    Submit
                </Button>
            </form>
        </div>
    );
};

export default NewTicket;
