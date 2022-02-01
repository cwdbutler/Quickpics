import { withUrqlClient } from "next-urql";
import Router from "next/router";
import { usePostQuery } from "../../graphql/generated/graphql";
import { urqlClient } from "../../urqlClient";
import { isServer } from "../../utis/isServer";

type Props = {};

function Post({}: Props) {
  // const [{data, fetching}] = usePostQuery({
  //   variables: {
  //     id: Router.query.id
  //   }
  // })

  if (!isServer()) {
    console.log(Router.query.id);
  }

  return <div></div>;
}

export default withUrqlClient(urqlClient, { ssr: true })(Post);
