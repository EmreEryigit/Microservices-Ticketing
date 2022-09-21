import axios from "axios";
import { ReactNode, useState } from "react";

const useRequest = ({ url, method, body, onSuccess }: Hook) => {
    const [errors, setErrors] = useState<ReactNode>(null);

    const doRequest = async (props = {}) => {
        try {
            setErrors(null);
            const response = await axios[method](url, {
                ...body,
                ...props,
            });
            if (onSuccess) {
                onSuccess(response.data);
            }
            return response.data;
        } catch (err: any) {
            setErrors(
                <div className="alert  alert-danger">
                    <ul className="my-0 ">
                        {err.response?.data.errors?.map(
                            (err: { message: string }) => (
                                <li key={err.message}>{err.message}</li>
                            )
                        )}
                    </ul>
                </div>
            );
        }
    };

    return { doRequest, errors };
};
export default useRequest;
