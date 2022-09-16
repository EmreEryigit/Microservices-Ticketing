import axios from "axios";

const buildClient = ({ req }) => {
    if (typeof window === "undefined") {
        // we are on the server

        // to create a axios client which is preconfigured for baseURL and headers
        return axios.create({
            baseURL:
                "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
            headers: req.headers,
        });

        //http://SERVICENAME.NAMESPACE.svc.cluster.local
    } else {
        // we are on the browser

        return axios.create({
            baseURL: "/",
        });
    }
};

export default buildClient;
