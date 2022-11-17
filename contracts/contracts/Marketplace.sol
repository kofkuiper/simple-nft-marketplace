// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Marketplace {
    struct Item {
        address nft;
        uint256 id;
        uint256 price;
        address seller;
    }

    // nft => id => Item
    mapping(address => mapping(uint256 => Item)) public items;
    IERC20 public immutable payToken;

    event Listed(
        address indexed nft,
        uint256 indexed id,
        address indexed seller,
        uint256 price
    );
    event Canceled(
        address indexed nft,
        uint256 indexed id,
        address indexed seller,
        uint256 price
    );
    event Bought(
        address indexed nft,
        uint256 indexed id,
        address indexed buyer,
        uint256 price
    );

    constructor(IERC20 _paytoken) {
        payToken = _paytoken;
    }

    function listNFT(
        address nft,
        uint256 id,
        uint256 price
    ) public {
        IERC721(nft).transferFrom(msg.sender, address(this), id);
        items[nft][id] = Item({
            nft: nft,
            id: id,
            price: price,
            seller: msg.sender
        });
        emit Listed(nft, id, msg.sender, price);
    }

    function cancelListing(address nft, uint256 id) public {
        Item memory item = items[nft][id];
        require(msg.sender == item.seller, "!seller");
        delete items[nft][id];
        IERC721(nft).transferFrom(address(this), item.seller, item.id);
        emit Canceled(nft, id, item.seller, item.price);
    }

    function buy(
        address nft,
        uint256 id,
        uint256 amount
    ) public {
        Item memory item = items[nft][id];
        require(item.nft != address(0), "!listed");
        require(amount >= item.price, "invavlid amount");
        delete items[nft][id];
        payToken.transferFrom(msg.sender, item.seller, amount);
        IERC721(item.nft).transferFrom(address(this), msg.sender, item.id);
        emit Bought(nft, id, msg.sender, amount);
    }
}
